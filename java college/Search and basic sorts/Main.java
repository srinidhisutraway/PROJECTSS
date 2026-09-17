 import java.util.*;
public class Main
{
	public static void main(String[] args) {
	    Scanner sc=new Scanner(System.in);
	    int n=sc.nextInt();
 	     
	         
	        int[] arr=new int[n];
	        for(int j=0;j<n;j++){
	        arr[j]=sc.nextInt();
	        }
			int[] res=Swap(arr,n);
	        for(int j=0;j<n;j++){
	        System.out.print(res[j]+" ");
	        }
	    System.out.println();
	    }
	   
	
	static int[] Swap(int[] arr,int m){
		int left=0;
		int right=m-1;
	    while(left<right){
			 
	            int temp=arr[left];
	            arr[left]=arr[right];
	            arr[right]=temp;
				right--;
				left++;
	        }
	    return arr;
 	    }
	}
